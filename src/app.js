const express = require('express');
const employeeRoutes = require('./routes/employeeRoute');
const serviceRoutes = require('./routes/serviceRoute');
const procedureRoutes = require('./routes/procedureRoute');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/employees', employeeRoutes);
app.use('/services', serviceRoutes);
app.use('/procedures', procedureRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
