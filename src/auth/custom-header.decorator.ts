// custom-header.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const RequiredHeaders = (...headers: string[]) =>
  SetMetadata('required-headers', headers);
