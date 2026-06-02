import { medusaIntegrationTestRunner } from "@medusajs/test-utils";

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    describe("Live Shopping API", () => {
      it("should create a live stream as a vendor", async () => {
        // Mock authentication context for vendor
        const response = await api.post("/vendor/live-streams", {
          title: "New Stream",
          description: "Testing live shopping"
        });

        expect(response.status).toBe(200);
        expect(response.data.stream).toHaveProperty("id");
        expect(response.data.stream.title).toBe("New Stream");
      });

      it("should list active streams for customers", async () => {
          const response = await api.get("/store/live-streams");
          expect(response.status).toBe(200);
          expect(Array.isArray(response.data.streams)).toBe(true);
      });
    });
  },
});
