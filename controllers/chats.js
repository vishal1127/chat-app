exports.sendMessage = async (req, res, next) => {
  const { text } = req.body;
  try {
    const textData = await req.user.createChat({
      from: req.user.name,
      text: text,
    });
    res.status(200).json({ message: "Message sent", success: true });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};
