import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionModule } from './modules/session/session.module';
import { ProductModule } from './modules/product/product.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { UserModule } from './modules/user/user.module';
import { SellerModule } from './modules/seller/seller.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    SessionModule,
    ProductModule,
    InventoryModule,
    UserModule,
    SellerModule,
    CategoryModule,
  ],
})
export class AppModule {}
