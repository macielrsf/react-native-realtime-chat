// frontend/src/chat/infrastructure/mappers/ChatMapper.ts
import { Message } from '../../domain/entities/Message';
import { MessageDto } from '../http/ChatApi';

export class ChatMapper {
  static dtoToDomain(dto: MessageDto): Message {
    return Message.create({
      id: dto.id,
      from: dto.from,
      to: dto.to,
      body: dto.body,
      delivered: dto.delivered,
      deliveredAt: dto.deliveredAt,
      createdAt: dto.createdAt,
    });
  }

  static dtoListToDomain(dtos: MessageDto[]): Message[] {
    return dtos.map(dto => this.dtoToDomain(dto));
  }
}
