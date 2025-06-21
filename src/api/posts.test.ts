import { describe, it, expect, vi, beforeEach } from "vitest";
import type { PostFormData } from "../types/Post";

// Mock completo de axios
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn(),
    },
  },
};

const mockAxios = {
  create: vi.fn(() => mockAxiosInstance),
  default: {
    create: vi.fn(() => mockAxiosInstance),
  },
};

vi.mock("axios", () => mockAxios);

// Mock del store de autenticación
const mockAuthStore = {
  getState: vi.fn(() => ({ token: "test-token-123" })),
};

vi.mock("../store/authStore", () => ({
  useAuthStore: mockAuthStore,
}));

// Mock de import.meta.env
vi.stubGlobal("import", {
  meta: {
    env: {
      VITE_POST_URL: "http://localhost:3002/api/posts",
    },
  },
});

// Importar las funciones después de los mocks
const { getPosts, likePost, createPost, getUserPosts } = await import(
  "./posts"
);

describe("Post Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPosts", () => {
    it("should fetch all posts successfully", async () => {
      const mockPosts = [
        { id: "1", title: "Post 1", content: "Content 1" },
        { id: "2", title: "Post 2", content: "Content 2" },
      ];

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockPosts,
      });

      const result = await getPosts();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/");
      expect(result).toEqual(mockPosts);
    });

    it("should handle error when fetching posts fails", async () => {
      const mockError = new Error("Network error");
      mockAxiosInstance.get.mockRejectedValueOnce(mockError);

      await expect(getPosts()).rejects.toThrow("Network error");
      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/");
    });
  });

  describe("likePost", () => {
    it("should like a post successfully", async () => {
      const postId = "post-123";
      const mockResponse = { success: true, likes: 5 };

      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await likePost(postId);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/like", { postId });
      expect(result).toEqual(mockResponse);
    });

    it("should handle error when liking post fails", async () => {
      const postId = "post-123";
      const mockError = new Error("Like failed");
      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      await expect(likePost(postId)).rejects.toThrow("Like failed");
      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/like", { postId });
    });
  });

  describe("createPost", () => {
    it("should create a new post successfully", async () => {
      const mockPostData: PostFormData = {
        message: "New Post",
      };

      const mockResponse = {
        id: "new-post-123",
        ...mockPostData,
        createdAt: "2024-01-01T00:00:00Z",
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await createPost(mockPostData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/", mockPostData);
      expect(result).toEqual(mockResponse);
    });

    it("should handle error when creating post fails", async () => {
      const mockPostData: PostFormData = {
        message: "New Post",
      };

      const mockError = new Error("Creation failed");
      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      await expect(createPost(mockPostData)).rejects.toThrow("Creation failed");
      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/", mockPostData);
    });

    it("should create post with minimal data", async () => {
      const mockPostData: PostFormData = {
        message: "Minimal Post",
      };

      const mockResponse = { id: "minimal-post", ...mockPostData };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await createPost(mockPostData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/", mockPostData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getUserPosts", () => {
    it("should fetch user posts successfully", async () => {
      const userId = "user-456";
      const mockUserPosts = [
        { id: "1", title: "User Post 1", userId },
        { id: "2", title: "User Post 2", userId },
      ];

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockUserPosts,
      });

      const result = await getUserPosts(userId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/user/${userId}`);
      expect(result).toEqual(mockUserPosts);
    });

    it("should handle error when fetching user posts fails", async () => {
      const userId = "user-456";
      const mockError = new Error("User posts fetch failed");
      mockAxiosInstance.get.mockRejectedValueOnce(mockError);

      await expect(getUserPosts(userId)).rejects.toThrow(
        "User posts fetch failed"
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/user/${userId}`);
    });

    it("should handle empty user posts response", async () => {
      const userId = "user-456";
      mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

      const result = await getUserPosts(userId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/user/${userId}`);
      expect(result).toEqual([]);
    });
  });

  describe("Error Handling", () => {
    it("should handle network timeout errors", async () => {
      const timeoutError = new Error("Network timeout");
      timeoutError.name = "ECONNABORTED";
      mockAxiosInstance.get.mockRejectedValueOnce(timeoutError);

      await expect(getPosts()).rejects.toThrow("Network timeout");
    });

    it("should handle HTTP error responses", async () => {
      const httpError = {
        response: {
          status: 404,
          data: { message: "Posts not found" },
        },
      };
      mockAxiosInstance.get.mockRejectedValueOnce(httpError);

      await expect(getPosts()).rejects.toEqual(httpError);
    });

    it("should handle unauthorized errors", async () => {
      const unauthorizedError = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        },
      };
      mockAxiosInstance.post.mockRejectedValueOnce(unauthorizedError);

      await expect(likePost("post-123")).rejects.toEqual(unauthorizedError);
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle multiple consecutive API calls", async () => {
      const userId = "user-123";
      const postData: PostFormData = { message: "Test" };

      // Mock responses
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: { id: "new-post", ...postData },
      });
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: [{ id: "new-post", ...postData }],
      });
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: { success: true, likes: 1 },
      });

      // Crear post
      const newPost = await createPost(postData);
      expect(newPost.id).toBe("new-post");

      // Obtener posts del usuario
      const userPosts = await getUserPosts(userId);
      expect(userPosts).toHaveLength(1);

      // Dar like al post
      const likeResult = await likePost(newPost.id);
      expect(likeResult.success).toBe(true);
    });
  });
});
