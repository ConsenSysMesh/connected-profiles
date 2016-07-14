export class IpfsProviderStub {
  constructor(stubs) {
    this.stubs = stubs;
  }

  add(text, callback) {
    const [err, hash] = this.stubs.add(text);
    callback(err, { Hash: hash });
  }

  cat(hash, callback) {
    const [err, result] = this.stubs.cat(hash);
    callback(err, result);
  }

  get Buffer() {
    return Buffer;
  }
}
