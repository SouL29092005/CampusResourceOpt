import Counter from "../../utils/counter.model.js";

export const generateAccessionNumbers = async (count, category) => {
  if (count <= 0) {
    throw new Error("Invalid count");
  }

  const prefix = `LIB-${category}`;
  const year = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { name: prefix },
    { $inc: { seq: count } },
    { new: true, upsert: true }
  );

  const start = counter.seq - count + 1;
  const end = counter.seq;

  return Array.from({ length: count }, (_, i) => {
    const num = String(start + i).padStart(6, "0");

    return {
      accessionNumber: `ACC-${year}-${category}-${num}`,
      bookNumber: `${prefix}-${num}`,
    };
  });
};
