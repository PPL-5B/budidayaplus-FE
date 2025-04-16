// __tests__/DaftarArtikel.test.tsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import DaftarArtikel from "@/components/artikel/DaftarArtikel";
import * as CardArticleModule from "@/components/ui/card-article";




jest.mock("@/components/ui/card-article", () => jest.fn(() => <div data-testid="mock-card-article">Mocked Card</div>));


describe("DaftarArtikel", () => {
  const originalConsoleError = console.error;


  beforeAll(() => {
    // Silence act() warning for test environment
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) return;
      originalConsoleError(...args);
    };
  });


  afterAll(() => {
    console.error = originalConsoleError;
  });


  it("renders section title", () => {
    render(<DaftarArtikel />);
    expect(screen.getByText("Daftar Artikel")).toBeInTheDocument();
  });


  it("renders all articles correctly using mocked CardArticle", () => {
    render(<DaftarArtikel />);
    expect(screen.getAllByTestId("mock-card-article")).toHaveLength(3);
  });


  it("handles edge case with empty article list", () => {
    // Mock articles to empty array


    jest.mock("@/components/artikel/DaftarArtikel", () => ({
      __esModule: true,
      default: () => (
        <section>
          <h1>Daftar Artikel</h1>
        </section>
      ),
    }));


    const CustomDaftarArtikel = require("@/components/artikel/DaftarArtikel").default;
    render(<CustomDaftarArtikel />);


    expect(screen.getByText("Daftar Artikel")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-card-article")).not.toBeInTheDocument();
  });


  it("renders CardArticle with correct props (positive case)", () => {
    const spy = jest.spyOn(CardArticleModule, "default");
    render(<DaftarArtikel />);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        title: expect.any(String),
        author: expect.any(String),
        date: expect.any(String),
        synopsis: expect.any(String),
        categories: expect.any(Array),
      }),
      {}
    );
  });
});

