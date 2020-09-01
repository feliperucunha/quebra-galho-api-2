import {Request, Response} from 'express';
 
import db from '../database/connection';
import converHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ServicesController {
    async index(req: Request, res: Response) {
        const filters = req.query;
        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        //verifica se o filtro está vazio
        if(!filters.subject || !filters.week_day || !filters.time) {
            return res.status(400).json({
                error: 'Missing filters to search services'
            })
        }

        const timeInMinutes = converHourToMinutes(time);

        const services = await db('services')
            //verifica se tem horário disponível
            .whereExists(function() {
                this.select('service_schedule.*')
                    .from('service_schedule')
                    //verifica se os horários cadastrados estão de acordo com os filtrados
                    .whereRaw('`service_schedule`.`service_id` = `services`.`id`')
                    .whereRaw('`service_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`service_schedule`.`from` <= ??', [timeInMinutes])
            })
            .where('services.subject', '=', subject)
            .join('users', 'services.user_id', '=', 'users.id')
            .select(['services.*', 'users.*']);

        return res.json(services);
    }


    async create(req: Request, res: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = req.body;
    
        const trx = await db.transaction();
    
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
        
            const serviceSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return {
                    service_id,
                    week_day: scheduleItem.week_day,
                    from: converHourToMinutes(scheduleItem.from),
                    to: converHourToMinutes(scheduleItem.to),
                };
            })
        
            await trx('service_schedule').insert(serviceSchedule);
        
            await trx.commit();
        
            return res.status(201).send();
        } catch (error) {
            console.log(error)
            await trx.rollback();
            return res.status(400).json({
                error: 'Unexpected error while creating new service'
            })
        }
    }
}