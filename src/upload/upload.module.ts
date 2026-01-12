import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { Admin } from '../auth/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
