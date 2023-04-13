const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  CREATED: "Created",
  OK: "OK",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).set(headers).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      message,
      metadata,
    });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    options,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata,
  }) {
    super({
      message,
      statusCode,
      reasonStatusCode,
      metadata,
    });
    this.options = options;
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse,
};
