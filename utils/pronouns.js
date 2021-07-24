export default function pronouns(pronouns) {
  switch (pronouns) {
    case "he":
      return "He/Him";
    case "she":
      return "She/Her";
    case "they":
      return "They/Them";
    default:
      return "";
  }
}