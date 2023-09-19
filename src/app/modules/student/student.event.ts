import { RedisClient } from '../../../shared/redis';
import {
  EVENT_STUDENT_CREATED,
  EVENT_STUDENT_UPDATED,
} from './student.constant';
import { StudentServices } from './student.service';

const initStudentEvents = () => {
  RedisClient.subscribe(EVENT_STUDENT_CREATED, async (e: string) => {
    const data = JSON.parse(e);
    await StudentServices.createStudentFromEvent(data);
  });

  RedisClient.subscribe(EVENT_STUDENT_UPDATED, async (e: string) => {
    const data = JSON.parse(e);

    await StudentServices.updateStudentFromEvent(data);
  });
};

export default initStudentEvents;
