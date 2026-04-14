const { TableClient } = require("@azure/data-tables");
const crypto = require("crypto");

module.exports = async function (context, req) {
  try {
    const { email, lastname } = req.body || {};

    if (!email || !lastname) {
      return { status: 400, body: { error: "Missing fields" } };
    }

    const tableClient = TableClient.fromConnectionString(
      process.env.STORAGE_CONNECTION_STRING,
      "Submissions"
    );

    await tableClient.createEntity({
      partitionKey: "form",
      rowKey: crypto.randomUUID(),
      email,
      lastname,
      createdAt: new Date().toISOString()
    });

    return { status: 200, body: { success: true } };

  } catch (err) {
    context.log(err);
    return { status: 500, body: { error: "Server error" } };
  }
};
