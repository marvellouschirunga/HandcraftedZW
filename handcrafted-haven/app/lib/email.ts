import { MailtrapClient } from "mailtrap";
import nodemailer from "nodemailer";

type profile = { name: string; email: string };

const TOKEN = process.env.MAILTRAP_TOKEN!;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT!;

const client = new MailtrapClient({ token: TOKEN});

const sender = {
  email: "verification@handcraftedzw.tech",
  name: "HandcraftedHaven",
};

interface EmailOptions {
  profile: profile;
  subject: "verification" | "forget-password" | "password-changed";
  linkUrl?: string;
}

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "52e15cf836e980",
      pass: "afd56db7a30eb2",
    },
  });
  return transport;
};

const sendEmailVerificationLink = async (profile: profile, linkUrl: string) => {
  // const transport = generateMailTransporter();
  // await transport.sendMail({
  //   from: "verification@handcraftedzw.tech",
  //   to: profile.email,
  //   html: `<h1>Please verify your email by clicking on <a href="${linkUrl}">this link</a> </h1>`,
  // });

  const recipients = [
    {
      email: profile.email,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "ae18bad5-ec75-4183-8bae-56a8fd244ee1",
    template_variables: {
      "user_name": profile.name,
      "next_step_link": linkUrl,
    }
  });
};

const sendForgetPasswordLink = async (profile: profile, linkUrl: string) => {
  // const transport = generateMailTransporter();

  // await transport.sendMail({
  //   from: "verification@handcraftedzw.tech",
  //   to: profile.email,
  //   html: `<h1>Click on <a href="${linkUrl}">this link</a> to reset your password.</h1>`,
  // });

  const recipients = [
    {
      email: profile.email,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "f6bfe221-3699-4344-a393-118160f9c726",
    template_variables: {
      "pass_reset_link": linkUrl,
      "user_email": profile.name
    },
  });
};

const sendUpdatePasswordConfirmation = async (profile: profile) => {
  // const transport = generateMailTransporter();

  // await transport.sendMail({
  //   from: "verification@handcraftedhaven.com",
  //   to: profile.email,
  //   html: `<h1>We changed your password <a href="${process.env.SIGN_IN_URL}">click here</a> to sign in.</h1>`,
  // });

  const recipients = [
    {
      email: profile.email,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "26453ddb-780b-4e36-846f-e07c28dadac3",
    template_variables: {
      "user_email": profile.name,
      "pass_reset_link": process.env.SIGN_IN_URL!
    },
  });
};

export const sendEmail = (options: EmailOptions) => {
  const { profile, subject, linkUrl } = options;

  switch (subject) {
    case "verification":
      return sendEmailVerificationLink(profile, linkUrl!);
    case "forget-password":
      return sendForgetPasswordLink(profile, linkUrl!);
    case "password-changed":
      return sendUpdatePasswordConfirmation(profile);
  }
};
