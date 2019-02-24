import { client } from "@root/sendgrid.client";
import { stripHtml } from "./stripHtml";

export const sendemail = async (receiver, subject, html) => {
  const text = stripHtml(html);

  const result = await client.send({
    to: receiver,
    from: process.env.EMAIL_ACTOR,
    subject,
    html,
    text
  });

  return result;
};

export default sendemail;
