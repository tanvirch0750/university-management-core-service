import { RedisClient } from '../../../shared/redis';
import {
  EVENT_FACULTY_CREATED,
  EVENT_FACULTY_UPDATED,
} from './faculty.constant';
import { FacultyCreatedEvent } from './faculty.interface';
import { FacultyServices } from './faculty.service';

const initFacultyEvents = () => {
  RedisClient.subscribe(EVENT_FACULTY_CREATED, async (e: string) => {
    const data: FacultyCreatedEvent = JSON.parse(e);

    await FacultyServices.createFacultyFromEvent(data);
  });

  RedisClient.subscribe(EVENT_FACULTY_UPDATED, async (e: string) => {
    const data = JSON.parse(e);
    console.log(data);
    await FacultyServices.updateFacultyFromEvent(data);
  });
};

export default initFacultyEvents;
