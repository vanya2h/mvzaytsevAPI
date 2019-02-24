export const stripHtml = string => string.replace(/(<([^>]+)>)/gi, "");

export default stripHtml;
