export class NoActiveCompanyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoActiveCompanyError";
  }
}
