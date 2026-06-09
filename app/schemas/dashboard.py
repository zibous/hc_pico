# app/schemas/dashboard.py
from pydantic import BaseModel, Field
from app.schemas.current import CurrentResponse
from app.schemas.summary import SummaryResponse
from app.schemas.chart import ChartResponse

class SystemMeta(BaseModel):
    servertime: str
    apptitle: str
    appversion: str
    language: str
    name: str
    hersteller: str
    image: str
    laufzeit: str
    stunden: int
    hostname: str
    dataservice: str

class DashboardCombinedResponse(BaseModel):
    meta_data: SystemMeta = Field(..., alias="meta-data")
    current: CurrentResponse
    summary: SummaryResponse
    chart: ChartResponse
    model_config = {
        "populate_by_name": True
    }
