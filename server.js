const express = require("express");
const path = require("path");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", authRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

