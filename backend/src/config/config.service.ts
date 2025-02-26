import { Injectable } from '@nestjs/common';

@Injectable()
class ConfigService {
  private readonly envConfig: Record<string, string | undefined>;

  constructor() {
    this.envConfig = process.env;
  }

  get(key: string): string {
    const value = this.envConfig[key];
    return value !== undefined ? value : '';
  }

  getNumber(key: string): number {
    const value = this.get(key);
    return value ? Number(value) : 0;
  }

  getBoolean(key: string): boolean {
    return this.get(key) === 'true';
  }
}

export default ConfigService;
