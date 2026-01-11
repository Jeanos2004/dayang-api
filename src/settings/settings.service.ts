import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {}

  async findOne(): Promise<Setting> {
    let settings = await this.settingsRepository.findOne({
      order: { created_at: 'DESC' },
    });

    if (!settings) {
      settings = this.settingsRepository.create({
        site_name: 'Dayang Transport',
      });
      settings = await this.settingsRepository.save(settings);
    }

    return settings;
  }

  async update(updateSettingsDto: UpdateSettingsDto): Promise<Setting> {
    const settings = await this.findOne();
    Object.assign(settings, updateSettingsDto);
    return this.settingsRepository.save(settings);
  }
}
