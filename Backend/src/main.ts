// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🛡️ CORS ayarı: Frontend 3000'den geliyor, Backend 3333'te.
  app.enableCors({
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }); 

  // 🚀 İşte senin istediğin port: 3333
  await app.listen(3333);
  console.log('✅ SİSTEM GÜNCELLENDİ: Backend 3333 portunda hazır!');
}
bootstrap();