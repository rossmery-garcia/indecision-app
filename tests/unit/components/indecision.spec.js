import { shallowMount } from '@vue/test-utils';
import Indecision from '@/components/Indecision.vue';

describe('Indecision component tests', () => {

  let wrapper;
  let clgSpy;

  global.fetch = jest.fn( () => Promise.resolve({
    json: () => Promise.resolve({
      answer: 'yes',
      forced: false,
      image: 'https://yesno.wtf/assets/yes/2.gif'
    })
  }));

  beforeEach( () => {

    wrapper = shallowMount( Indecision );

    clgSpy = jest.spyOn( console, 'log' );

    jest.clearAllMocks();
  });

  test('Must match the snapshot', () => {

    expect( wrapper.html() ).toMatchSnapshot();
  });

  test('Write to the input should not trigger request (console.log)', async () => {

    const getAnswerSpy = jest.spyOn( wrapper.vm, 'getAnswer');

    const input = wrapper.find('input');
    await input.setValue('Hello World');

    expect( clgSpy ).toHaveBeenCalledTimes(1);
    expect( getAnswerSpy ).not.toHaveBeenCalled();
  });

  test('typing "?" should trigger the getAnswer', async () => {

    const getAnswerSpy = jest.spyOn( wrapper.vm, 'getAnswer');

    const input = wrapper.find('input');
    await input.setValue('Hello World?');

    expect( getAnswerSpy ).toHaveBeenCalled();
  });

  test('getAnswer tests', async () => {

    await wrapper.vm.getAnswer();

    const img = wrapper.find('img');

    expect( img.exists() ).toBeTruthy();
    expect( wrapper.vm.img ).toBe('https://yesno.wtf/assets/yes/2.gif');
    expect( wrapper.vm.answer ).toBe('Si!')
  });

  test('getAnswer tests - Failed API', async () => {

    fetch.mockImplementationOnce( () => Promise.reject('API is down') );

    await wrapper.vm.getAnswer();

    const img = wrapper.find('img');

    expect( img.exists() ).toBeFalsy();
    expect( wrapper.vm.answer ).toBe('API failed');
  });
});