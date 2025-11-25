import { render, screen, waitFor } from '@testing-library/react';
import Projects from './Projects';
import apiClient from '../services/apiClient';
import { MemoryRouter } from 'react-router-dom';

// Mock the apiClient
vi.mock('../services/apiClient', () => ({
    default: {
        get: vi.fn(),
    },
}));

test("renders projects list", async () => {
    apiClient.get.mockResolvedValueOnce({
      data: [
        { id: 1, name: "Demo Project", description: "Sample project" },
      ],
    });
  
    render(
    <MemoryRouter>
        <Projects />
    </MemoryRouter>
    );
    expect(
        screen.getByRole('heading', { name: /Proyectos/i })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Demo Project/i)).toBeInTheDocument();
    });
  });

