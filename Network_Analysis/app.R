
library(shiny)

# Define server logic required to draw a histogram
server <- function(input, output) {

    

}

shinyApp(ui = htmlTemplate("www/network.html",
                           button = actionButton("action", "Action"),
                           slider = sliderInput("x", "X", 1, 100, 50)), server)
