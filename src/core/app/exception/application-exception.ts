export abstract class ApplicationException extends Error {
  code: string
  additionalInfo?: any

  constructor(code: string, message: string, additionalInfo?: any) {
    super(message)
    this.code = code
    this.additionalInfo = additionalInfo
  }

  get name() {
    return this.constructor.name
  }

  static get exceptionName() {
    return this.prototype.constructor.name
  }
}
