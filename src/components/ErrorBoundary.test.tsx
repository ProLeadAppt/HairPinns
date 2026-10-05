import { Children, isValidElement, lazy, Suspense, type ReactElement, type ReactNode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductDetailErrorBoundary } from "./ErrorBoundary";
import { loadLazyRoute } from "@/lib/lazyRouteRecovery";

vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/ui/button", () => ({ Button: "button" }));
vi.mock("react-router-dom", () => ({ Link: "a" }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function renderError(node: ReactNode): Promise<unknown> {
  return new Promise((resolve, reject) => {
    renderToPipeableStream(<Suspense fallback={null}>{node}</Suspense>, {
      onError: resolve,
      onAllReady: () => reject(new Error("Expected the lazy route to reject")),
    });
  });
}

function descendants(node: ReactNode): ReactElement<Record<string, unknown>>[] {
  if (!isValidElement<Record<string, unknown>>(node)) return [];
  return [node, ...Children.toArray(node.props.children as ReactNode).flatMap(descendants)];
}

describe("product route error recovery", () => {
  it("demonstrates that remounting a rejected lazy route does not retry its import", async () => {
    const error = new TypeError("Failed to fetch dynamically imported module: /assets/ProductDetail-old.js");
    const importer = vi.fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue({ default: () => <div>Product loaded</div> });
    const Product = lazy(importer);

    expect(await renderError(<Product key="first-product" />)).toBe(error);
    expect(await renderError(<Product key="second-product" />)).toBe(error);
    expect(importer).toHaveBeenCalledTimes(1);
  });

  it("does not describe render failures as a missing product and offers a full reload", () => {
    const reload = vi.fn();
    vi.stubGlobal("window", { location: { reload } });
    vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("Cannot read properties of undefined");
    const boundary = new ProductDetailErrorBoundary({ children: <div>Product</div> });
    boundary.state = ProductDetailErrorBoundary.getDerivedStateFromError(error);
    boundary.componentDidCatch(error, { componentStack: "ProductDetail" });

    const elements = descendants(boundary.render());
    const copy = elements.flatMap((node) => Children.toArray(node.props.children as ReactNode))
      .filter((child) => typeof child === "string").join(" ");
    expect(copy).not.toContain("Product not found");
    expect(copy).not.toContain("removed from our store");
    expect(copy).toContain("couldn't load this product");
    expect(reload).not.toHaveBeenCalled();
    const retry = elements.find((node) => node.props.children === "Reload Product");
    expect(retry).toBeDefined();
    (retry!.props.onClick as () => void)();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("recovers a marked lazy import through the mounted boundary only once per product", async () => {
    const entries = new Map<string, string>();
    const reload = vi.fn();
    vi.stubGlobal("window", {
      location: { pathname: "/products/shampoo", reload },
      sessionStorage: {
        getItem: (key: string) => entries.get(key) ?? null,
        setItem: (key: string, value: string) => entries.set(key, value),
      },
    });
    vi.spyOn(console, "error").mockImplementation(() => {});
    const importer = vi.fn(() => Promise.reject(new TypeError("Importing a module script failed.")));
    const Product = lazy(() => loadLazyRoute(importer));
    const error = await renderError(<Product />) as Error;
    expect(reload).not.toHaveBeenCalled();

    const catchInBoundary = (caught: Error) => {
      const boundary = new ProductDetailErrorBoundary({ children: <Product /> });
      boundary.state = ProductDetailErrorBoundary.getDerivedStateFromError(caught);
      boundary.componentDidCatch(caught, { componentStack: "ProductDetail" });
    };
    catchInBoundary(error);
    catchInBoundary(await renderError(<Product key="remounted" />) as Error);
    expect(reload).toHaveBeenCalledTimes(1);
    window.location.pathname = "/products/conditioner";
    catchInBoundary(await renderError(<Product key="another-product" />) as Error);
    expect(reload).toHaveBeenCalledTimes(2);
    expect(importer).toHaveBeenCalledTimes(1);
  });

  it("continues rendering its children when there is no render error", () => {
    const children = <div>Product details</div>;
    expect(new ProductDetailErrorBoundary({ children }).render()).toBe(children);
  });
});
