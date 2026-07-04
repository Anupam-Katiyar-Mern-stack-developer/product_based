const Message = require("../models/message");

exports.getMessageStats = async (req, res) => {
  try {
    const latest = await Message.findOne().sort({ createdAt: -1 });

   

    const data = await Message.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    

    res.json(data);
  } catch (error) {
   

    res.status(500).json({
      error: error.message,
    });
  }
};