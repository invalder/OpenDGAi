describe('generateDatasetMetadata', () => {
  let mockGenerateContent: jest.Mock;
  let generateDatasetMetadata: any;

  beforeEach(() => {
    jest.resetModules();
    mockGenerateContent = jest.fn();

    jest.doMock('@google/generative-ai', () => ({
      GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: mockGenerateContent,
        }),
      })),
    }));

    // Require the module under test after setting up the mock
    // Using dynamic require to ensure the mock is used
    const module = require('../src/services/aiMetadata');
    generateDatasetMetadata = module.generateDatasetMetadata;
  });

  it('should generate metadata correctly', async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          title: 'Test Title',
          description: 'Test Description',
          keywords: ['test'],
        }),
      },
    });

    const data = [{ id: 1, name: 'test' }];
    const result = await generateDatasetMetadata(data);

    expect(result.title).toBe('Test Title');
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it('should handle markdown code blocks', async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => '```json\n{"title": "Test"}\n```',
      },
    });

    const data = [{ id: 1, name: 'test' }];
    const result = await generateDatasetMetadata(data);

    expect(result.title).toBe('Test');
  });

  it('should handle errors', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API Error'));

    const data = [{ id: 1, name: 'test' }];
    await expect(generateDatasetMetadata(data)).rejects.toThrow('Unable to generate metadata');
  });
});
