export const resolveEntityId = entity => {
  if (typeof entity === "string") {
    return entity.toString();
  }

  if (typeof entity === "object" && entity._id) {
    return entity._id.toString();
  }

  return null;
};

export default resolveEntityId;
