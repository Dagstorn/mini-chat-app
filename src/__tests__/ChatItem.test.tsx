import { Chat } from '@/src/types/Chat';
import { render } from '@testing-library/react-native';
import React from 'react';
import { ChatItem } from '../components/ChatItem';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

const mockChat: Chat = {
  id: 'chat123',
  users: ['Alex', 'Josh'],
  lastMessage: 'See you soon!',
  timestamp: '10:45 AM',
  unreadCount: 3,
  messages: [],
};

describe('ChatItem', () => {
  it("renders other user's initials, name, last message, time, and unread count", () => {
    const { getByText } = render(
      <ChatItem chat={mockChat} currentUser="Alex" />,
    );

    // Check initials
    expect(getByText('J')).toBeTruthy();

    // Check name
    expect(getByText('Josh')).toBeTruthy();

    // Check last message
    expect(getByText('See you soon!')).toBeTruthy();

    // Check timestamp
    expect(getByText('10:45 AM')).toBeTruthy();

    // Check unread count
    expect(getByText('3')).toBeTruthy();
  });

  it('hides unread count badge when unreadCount is 0', () => {
    const chatWithNoUnread: Chat = { ...mockChat, unreadCount: 0 };
    const { queryByText } = render(
      <ChatItem chat={chatWithNoUnread} currentUser="Alex" />,
    );

    // Badge should not be present
    expect(queryByText('3')).toBeNull();
  });

  it('renders fallback if other user is not found', () => {
    const brokenChat: Chat = {
      ...mockChat,
      users: ['Alex'], // no other user
    };
    const { getByText } = render(
      <ChatItem chat={brokenChat} currentUser="Alex" />,
    );

    expect(getByText('U')).toBeTruthy(); // "Unknown" → initials = "U"
    expect(getByText('Unknown')).toBeTruthy();
  });
});
