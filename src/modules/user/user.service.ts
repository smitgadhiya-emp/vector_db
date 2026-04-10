import { User } from "./user.model";
import { IUser } from "./user.interface";
import { generateEmbedding } from "../../services/embedding.service";
import { commonQueryEmbedding } from "../../services/rag.service";
import { getUserCollection } from "../../config/chroma";
import { openai } from "../../config/openai";
import { publishToQueue } from "../../config/rabbitMQ";

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  const user = await User.create(data);

  if (data.bio) {
    const embedding = await generateEmbedding(data.bio);
    const collection = await getUserCollection();
    await collection.upsert({
      ids: [user._id.toString()],
      embeddings: [embedding],
      documents: [data.bio],
      metadatas: [{ email: user.email, name: user.name }],
    });
  }

  return user;
};

export const findAllUsers = async (query?: string): Promise<IUser[]> => {
  if (!query) {
    return User.find().sort({ createdAt: -1 });
  }

  const { embedding } = await commonQueryEmbedding(query);
  const collection = await getUserCollection();
  const results = await collection.query({
    queryEmbeddings: [embedding],
    nResults: 5,
  });

  const ids = results.ids?.[0] ?? [];
  if (ids.length === 0) return [];

  const users = await User.find({ _id: { $in: ids } });
  // preserve similarity order returned by Chroma
  const order = new Map(ids.map((id, i) => [id, i]));
  return users.sort(
    (a, b) =>
      (order.get(a._id.toString()) ?? 0) - (order.get(b._id.toString()) ?? 0),
  );
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

export const updateUserById = async (
  id: string,
  data: Partial<IUser>,
): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteUserById = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};

export const findQueryResults = async (query: string) => {
  try {
    const embedding = await commonQueryEmbedding(query);
    const collection = await getUserCollection();
    const results = await collection.query({
      queryEmbeddings: [embedding.embedding],
      nResults: 5,
    });

    const prompt = generatePrompt(results.documents.join("\n"), query);

    console.log("Generated prompt:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    await publishToQueue("sms", "Hello from RabbitMQ 1!")

    return response.choices[0].message.content;
  } catch (error) {
    return error;
  }
};

function generatePrompt(context: string, query: string) {
  const prompt = `
  You are a helpful and friendly chatbot.

  Use ONLY the context below to answer the question.

  If the answer is not available, respond politely that you don’t have enough information.

  Context:
  ${context}

  User Question:
  ${query}

  Answer in a conversational way:
  `;

  return prompt;
}
