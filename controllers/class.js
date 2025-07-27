const createClass = async (req, res) => {
  const { className, classTeacher } = req.body;

  if (!className) {
    return res
      .status(400)
      .json({ success: false, message: "class name is requirred!" });
  }

  
};
