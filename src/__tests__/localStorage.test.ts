import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from "../utils/localStorage";

describe("localStorage utility", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("saveToLocalStorage stores stringified data", () => {
    saveToLocalStorage("key", { name: "Alice" });
    expect(localStorage.getItem("key")).toBe(JSON.stringify({ name: "Alice" }));
  });

  it("getFromLocalStorage returns parsed data", () => {
    localStorage.setItem("key", JSON.stringify({ name: "Bob" }));
    const result = getFromLocalStorage<{ name: string }>("key");
    expect(result).toEqual({ name: "Bob" });
  });

  it("getFromLocalStorage returns null for non-existent key", () => {
    const result = getFromLocalStorage("missing");
    expect(result).toBeNull();
  });

  it("removeFromLocalStorage removes the item", () => {
    localStorage.setItem("key", JSON.stringify("value"));
    removeFromLocalStorage("key");
    expect(localStorage.getItem("key")).toBeNull();
  });

  it("handles complex objects correctly", () => {
    const complex = {
      id: 1,
      nested: { a: [1, 2, 3], b: { c: true } },
      date: "2024-01-01",
    };
    saveToLocalStorage("complex", complex);
    const result = getFromLocalStorage<typeof complex>("complex");
    expect(result).toEqual(complex);
  });

  it("handles arrays correctly", () => {
    const arr = [1, "two", { three: 3 }, [4, 5]];
    saveToLocalStorage("arr", arr);
    const result = getFromLocalStorage<typeof arr>("arr");
    expect(result).toEqual(arr);
  });

  it("getFromLocalStorage returns null when stored data is corrupted/invalid JSON", () => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue("{invalid json!!!");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = getFromLocalStorage("corrupt");
    expect(result).toBeNull();

    consoleSpy.mockRestore();
  });
});
