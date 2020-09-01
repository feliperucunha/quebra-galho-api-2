"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
const convertHourToMinutes_1 = __importDefault(require("../utils/convertHourToMinutes"));
class ServicesController {
    async index(req, res) {
        const filters = req.query;
        const subject = filters.subject;
        const week_day = filters.week_day;
        const time = filters.time;
        //verifica se o filtro está vazio
        if (!filters.subject || !filters.week_day || !filters.time) {
            return res.status(400).json({
                error: 'Missing filters to search services'
            });
        }
        const timeInMinutes = convertHourToMinutes_1.default(time);
        const services = await connection_1.default('services')
            //verifica se tem horário disponível
            .whereExists(function () {
            this.select('service_schedule.*')
                .from('service_schedule')
                //verifica se os horários cadastrados estão de acordo com os filtrados
                .whereRaw('`service_schedule`.`service_id` = `services`.`id`')
                .whereRaw('`service_schedule`.`week_day` = ??', [Number(week_day)])
                .whereRaw('`service_schedule`.`from` <= ??', [timeInMinutes]);
        })
            .where('services.subject', '=', subject)
            .join('users', 'services.user_id', '=', 'users.id')
            .select(['services.*', 'users.*']);
        return res.json(services);
    }
    async create(req, res) {
        const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body;
        const trx = await connection_1.default.transaction();
        try {
            const insertedUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });
            const user_id = insertedUsersIds[0];
            const insertedServicesIds = await trx('services').insert({
                subject,
                cost,
                user_id,
            });
            const service_id = insertedServicesIds[0];
            const serviceSchedule = schedule.map((scheduleItem) => {
                return {
                    service_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes_1.default(scheduleItem.from),
                    to: convertHourToMinutes_1.default(scheduleItem.to),
                };
            });
            await trx('service_schedule').insert(serviceSchedule);
            await trx.commit();
            return res.status(201).send();
        }
        catch (error) {
            console.log(error);
            await trx.rollback();
            return res.status(400).json({
                error: 'Unexpected error while creating new service'
            });
        }
    }
}
exports.default = ServicesController;
