export function respond(action) {
  return async (req, res) => {
    try {
      const result = await action(req, res);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
        stack: error.stack
      });
    }
  };
}
