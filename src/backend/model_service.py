from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from diffusers import StableDiffusionPipeline, AutoPipelineForText2Image
import base64
from io import BytesIO

app = FastAPI()

class GenerationRequest(BaseModel):
    prompt: str
    model_id: str
    negative_prompt: str = "blurry, bad quality, distorted"
    num_inference_steps: int = 20
    guidance_scale: float = 7.5

# Cache for loaded models
model_cache = {}

def get_pipeline(model_id: str):
    if model_id not in model_cache:
        if model_id == "stabilityai/sdxl-turbo":
            pipeline = AutoPipelineForText2Image.from_pretrained(
                model_id,
                torch_dtype=torch.float16,
                variant="fp16"
            )
        else:
            pipeline = StableDiffusionPipeline.from_pretrained(
                model_id,
                torch_dtype=torch.float16
            )
        
        if torch.cuda.is_available():
            pipeline = pipeline.to("cuda")
        model_cache[model_id] = pipeline
    
    return model_cache[model_id]

@app.post("/generate")
async def generate_image(request: GenerationRequest):
    try:
        pipeline = get_pipeline(request.model_id)
        
        image = pipeline(
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            num_inference_steps=request.num_inference_steps,
            guidance_scale=request.guidance_scale
        ).images[0]
        
        # Convert to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return {"image": f"data:image/png;base64,{img_str}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 