
export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  try {
    const accountSid = "AC9ea5c97490ad0602a6c8e92d9036ad81";
    const authToken = "b746c6e9f203a7aa58f121c1ace0132f";
    const client = require("twilio")(accountSid, authToken);

    const response = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: "+84" + toPhoneNumber,
    });

    return response;
  } catch (error) {
    console.log(error);
    return false;
  }
};
