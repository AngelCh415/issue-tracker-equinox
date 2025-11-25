import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Issues from "./Issues";
import api from "../services/apiClient";

vi.mock("../services/apiClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

test('faling to render issues list', async () => {
    // Simulate error
    api.get.mockRejectedValueOnce(new Error("Network Error"));

    render(
        <MemoryRouter>
          <Issues />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText("Error loading issues")).toBeInTheDocument();
    });
});

test("renders issues list", async () => {
    // Simulate data
    api.get.mockResolvedValueOnce({
        data: [
        {
            id: 1,
            title: "Issue One",
            description: "First issue description",
            status: "open",
            tags: ["bug"],
        },
        ],
    });
    render(
        <MemoryRouter>
          <Issues />
        </MemoryRouter>
    );
    
    expect(
        screen.getByRole('heading', { name: /Issues/i })
        ).toBeInTheDocument();
    
    await waitFor(() => {
        expect(screen.getByText(/Issue One/i)).toBeInTheDocument();
        expect(screen.getByText(/Tags: bug/i)).toBeInTheDocument();
    });
});

test("creates a new issue", async () => {
    // Initial fetch
    api.get.mockResolvedValueOnce({ data: [] });
    render(
        <MemoryRouter>
          <Issues />
        </MemoryRouter>
    );
    
    // Simulate creating an issue
    api.post.mockResolvedValueOnce({});
    api.get.mockResolvedValueOnce({
        data: [
        {
            id: 2,
            title: "New Issue",
            description: "New issue description",
            status: "open",
            tags: ["enhancement"],
        },
        ],
    });
    
    // Fill form and submit
    const titleInput = screen.getByPlaceholderText("Título");
    const descInput = screen.getByPlaceholderText("Descripción");
   
    fireEvent.change(titleInput, { target: { value: "New Issue" } });
    fireEvent.change(descInput, { target: { value: "New issue description" } });
    
    const createButton = screen.getByRole("button", { name: /Crear issue/i });
    fireEvent.click(createButton);
    
    await waitFor(() => {
        expect(screen.getByText("New Issue")).toBeInTheDocument();
    });
});


test("updates an issue", async () => {
    // Initial fetch
    api.get.mockResolvedValueOnce({
        data: [
        {
            id: 3,
            title: "Old Issue",
            description: "Old description",
            status: "open",
        },
        ],
    });
    render(
        <MemoryRouter>
            <Issues />
        </MemoryRouter>
    );
    
    await waitFor(() => {
        expect(screen.getByText("Old Issue")).toBeInTheDocument();
    });
    
    // Simulate updating an issue
    api.put.mockResolvedValueOnce({});
    api.get.mockResolvedValueOnce({
        data: [
        {
            id: 3,
            title: "Updated Issue",
            description: "Updated description",
            status: "open",
        },
        ],
    });
    
    // Click edit, change values and submit
    const editButton = screen.getByRole("button", { name: /Editar/i });
    fireEvent.click(editButton);
    
    const titleInput = screen.getByDisplayValue("Old Issue");
    const descInput = screen.getByDisplayValue("Old description");
    
    fireEvent.change(titleInput, { target: { value: "Updated Issue" } });
    fireEvent.change(descInput, { target: { value: "Updated description" } });
    
    const saveButton = screen.getByRole("button", { name: /Guardar cambios/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
        expect(screen.getByText("Updated Issue")).toBeInTheDocument();
    });
  
});

