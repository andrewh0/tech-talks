const Hashids = require('hashids');
const { HASHID_SALT } = require('../../config/secrets');

const VIDEO_ENCODED_ID_LENGTH = 10;
const videoHashId = new Hashids(HASHID_SALT, VIDEO_ENCODED_ID_LENGTH);

module.exports = {
  videoHashId
};
