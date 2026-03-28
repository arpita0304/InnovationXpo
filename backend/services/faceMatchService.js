const runFaceMatch = (imagePath) => {
  return Promise.resolve({
    matched: false,
    camera: null,
    time: null
  });
};

module.exports = { runFaceMatch };