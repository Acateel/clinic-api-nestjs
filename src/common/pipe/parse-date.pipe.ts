import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date | null> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!(metadata.type === 'query') || !metadata.data) {
      throw new Error('Date transform pipe was used incorrectly');
    }

    const date = new Date(value);
    const isValid = date instanceof Date && !isNaN(date.getTime());

    return isValid ? date : null;
  }
}
