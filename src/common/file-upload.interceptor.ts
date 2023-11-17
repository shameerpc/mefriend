import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { multer } from 'multer';

@Injectable()
export class ImageUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const storage = multer.diskStorage({
      destination: './uploads/images', // Define the storage location for uploaded images
      filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    });

    const upload = multer({ storage }).single('file');
    return new Observable((observer) => {
      upload(request, undefined, (error) => {
        if (error) {
          observer.error(error);
        } else {
          // Set file permissions metadata based on your logic here
          const permissions = ['read', 'write'];
          SetMetadata('permissions', permissions)(request);
          observer.next();
          observer.complete();
        }
      });
    });
  }
}
