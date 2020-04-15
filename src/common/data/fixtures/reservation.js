import { Factory } from 'rosie';

export default new Factory()
  .sequence('id')
  .attr('url', 'https://respa.koe.hel.ninja/v1/reservation/192388/')
  .sequence('resource')
  .attr('begin', '')
  .attr('end', '')
  .attr('event_description', '')
  .attr('event_subject', '')
  .attr('has_catering_order', false)
  .attr('its_own', false)
  .attr('staff_event', false)
  .attr('state', 'requested')
  .attr('user', {})
  .attr('user_permissions', null)
  .attr('comments', '');
