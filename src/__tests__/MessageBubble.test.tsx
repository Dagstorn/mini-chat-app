import { Message } from '@/src/types/Message';
import { render } from '@testing-library/react-native';
import React from 'react';
import { MessageBubble } from '../components/MessageBubble';

const mockMessage: Message = {
  id: 'msg1',
  text: 'Hello world',
  chatId: 'chat1',
  sender: 'user1',
  timestamp: '11:30 AM',
  seenBy: ['user1'],
};

describe('MessageBubble', () => {
  it('renders message sent by me with checkmark icon', () => {
    const { getByText, getByTestId } = render(
      <MessageBubble
        message={mockMessage}
        isMe={true}
        renderCheckMarks={() => false}
      />,
    );

    expect(getByText('Hello world')).toBeTruthy();
    expect(getByText('11:30 AM')).toBeTruthy();
    expect(getByTestId('checkmark-icon')).toBeTruthy();
  });

  it('renders double checkmark when renderCheckMarks returns true', () => {
    const { getByTestId, getByText } = render(
      <MessageBubble
        message={mockMessage}
        isMe={true}
        renderCheckMarks={() => true}
      />,
    );

    expect(getByText('Hello world')).toBeTruthy();
    expect(getByTestId('checkmark-icon')).toBeTruthy();
  });

  it('renders message from others without checkmark icon', () => {
    const { queryByTestId } = render(
      <MessageBubble
        message={mockMessage}
        isMe={false}
        renderCheckMarks={() => true}
      />,
    );

    expect(queryByTestId('checkmark-icon')).toBeNull();
  });
});
