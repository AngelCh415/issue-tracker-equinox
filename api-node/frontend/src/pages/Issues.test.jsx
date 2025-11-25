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
        data: [{
            id: 1,
            name: "Demo Project",
            description: "A demo project for testing",
        }
        ],
    });
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
    api.get
    .mockResolvedValueOnce({
      data: [
        { id: 1, name: "Project A", description: "Test project" },
      ],
    })
    api.get.mockResolvedValueOnce({ data: [] });
    render(
        <MemoryRouter>
          <Issues />
        </MemoryRouter>
    );
    
    // Simulate creating an issue
    await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByText("Project A")).toBeInTheDocument();
    });
    api.post.mockResolvedValueOnce({});
    api.get.mockResolvedValueOnce({
        data: [
        {
            id: 2,
            proyectId: 1,
            title: "New Issue",
            description: "New issue description",
            status: "open",
            tags: ["enhancement"],
        },
        ],
    });
    
 
    const projectSelect = screen.getByRole("combobox");
    fireEvent.change(projectSelect, { target: { value: "1" } });
  
    const titleInput = screen.getByPlaceholderText(/Título/i);
    const descInput = screen.getByPlaceholderText(/Descripción/i);

    fireEvent.change(titleInput, { target: { value: "New Issue" } });
    fireEvent.change(descInput, { target: { value: "New issue description" } });

    const createButton = screen.getByRole("button", { name: /Crear Issue/i });
    fireEvent.click(createButton);
    screen.debug();
    await waitFor(() => {
        expect(screen.getByText("New Issue")).toBeInTheDocument();
    });
});


test("updates an issue", async () => {
    // Initial fetch
    api.get
    .mockResolvedValueOnce({
        data: [
            { id: 1, name: "Project A", description: "Test project" },
        ],
    })
    api.get.mockResolvedValueOnce({
        data: [
        {
            id: 1,
            proyectId: 1,
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
    
    // Simulate editing an issue
    await waitFor(() => {
        expect(screen.getByText(/Issue One/i)).toBeInTheDocument();
    });
    
    const editButton = screen.getByRole("button", { name: /Editar/i });
    fireEvent.click(editButton);
    await waitFor(() => {
        expect(screen.getByText(/Editando issue #1/i)).toBeInTheDocument();
    });
    
    const titleInput = screen.getByDisplayValue("Issue One");
    const descInput = screen.getByDisplayValue("First issue description");
    fireEvent.change(titleInput, { target: { value: "Updated Issue" } });
    fireEvent.change(descInput, { target: { value: "Updated description" } });
    
    api.put.mockResolvedValueOnce({});
    api.get.mockResolvedValueOnce({
        data: [
        {
            id: 1,
            proyectId: 1,
            title: "Updated Issue",
            description: "Updated description",
            status: "open",
            tags: ["bug"],
        },
        ],
    });
    
    const updateButton = screen.getByRole("button", { name: /Guardar cambios/i });
    fireEvent.click(updateButton);
    
    await waitFor(() => {
        expect(screen.getByText("Updated Issue")).toBeInTheDocument();
    });
  
});

