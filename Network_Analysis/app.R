
library(shiny)

# Define server logic required to draw a histogram
server <- function(input, output, session) {


  observe({
    session$sendCustomMessage("force", input$strength)
  })
   
  # observe({
  #   session$sendCustomMessage("scale", input$scale)
  # })
  
  
 

}

shinyApp(ui = htmlTemplate("www/network.html"), server)
