"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const jobs_module_1 = require("./jobs/jobs.module");
const materials_module_1 = require("./materials/materials.module");
const wps_module_1 = require("./wps/wps.module");
const timecards_module_1 = require("./timecards/timecards.module");
const billing_module_1 = require("./billing/billing.module");
const dispatch_module_1 = require("./dispatch/dispatch.module");
const reports_module_1 = require("./reports/reports.module");
const prisma_service_1 = require("./common/database/prisma.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            auth_module_1.AuthModule,
            jobs_module_1.JobsModule,
            materials_module_1.MaterialsModule,
            wps_module_1.WpsModule,
            timecards_module_1.TimecardsModule,
            billing_module_1.BillingModule,
            dispatch_module_1.DispatchModule,
            reports_module_1.ReportsModule,
        ],
        providers: [prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map