package com.example.voting;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class VotingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(VotingServiceApplication.class, args);
	}	
}

// ENABLE CORS
@Configuration
class CorsConfiguration 
{
    @Bean
    public WebMvcConfigurer corsConfigurer() 
    {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                .maxAge(3600);
            }
        };
    }
}


// DATABASE MODEL / CONFIGURATION

@Configuration
class LoadVoterDatabase {

	private static final Logger log = LoggerFactory.getLogger(LoadVoterDatabase.class);

	@Bean
	CommandLineRunner initVoterDatabase(VoterRepository repository){
		
		Voter v1 = new Voter();
		v1.setName("Bean the Dog");
		v1.setQuestions((long) 1);
		
		Voter v2 = new Voter();
		v2.setName("Milo Meow");
		v2.setQuestions((long) 1);
		v2.setQuestions((long) 2);
		
		return args -> {
			 log.info("Preloading " + repository.save(v1));
		     log.info("Preloading " + repository.save(v2));
		    };
	}

}

@Configuration
class LoadQuestionDatabase {

	private static final Logger log = LoggerFactory.getLogger(LoadQuestionDatabase.class);

	@Bean
	CommandLineRunner initQuestionsDatabase(QuestionRepository repository){
		
		return args -> {
			 log.info("Preloading " + repository.save(new Question("Do you eat french fries with ketchup?")));
		     log.info("Preloading " + repository.save(new Question("Do drink coffee every day?")));
		     log.info("Preloading " + repository.save(new Question("If you found a $100 bill would you keep it?")));
		     log.info("Preloading " + repository.save(new Question("Does your dog bark at the mailperson?")));
		     log.info("Preloading " + repository.save(new Question("Are you happy with your job?")));
		    };
	}

}


// Need different interface for each entity
@Repository
interface VoterRepository extends JpaRepository<Voter, Long> {

	Voter findByNameIgnoreCase(String name);
}

@Repository
interface QuestionRepository extends JpaRepository<Question, Long> {

	@Query(value = "SELECT * FROM question WHERE question.id != :id", nativeQuery = true)
	List<Question> findAllQuestions(
			@Param("id") long id);
	
}


@Entity
@Table(name="voter")
class Voter {


	private @Id @GeneratedValue Long id;
	private String name;
	private ArrayList<Long> questions = new ArrayList<>();

	// Constructors
	public Voter() {}
	public Voter(String name) {
		super();
		this.name = name;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ArrayList<Long> getQuestions() {
		return questions;
	}

	public void setQuestions(Long question) {
		this.questions.add(question);
	}

	@Override
	public String toString() {
		return "Voter [id=" + id + ", Name=" + name + ", Questions=" + questions + "]";
	}

}


@Entity
@Table(name="question")
class Question {

	private @Id @GeneratedValue Long id;
	private String description;
	private Integer countNo = 0;
	private Integer countYes = 0;

	// Constructors
	public Question() {}
	public Question(String description) {
		super();
		this.description = description;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	public Integer getCountNo() {
		return countNo;
	}
	
	public void setCountNo() {
		this.countNo = countNo + 1;
	}
	
	public Integer getCountYes() {
		return countYes;
	}
	
	public void setCountYes() {
		this.countYes = countYes + 1;
	}

	@Override
	public String toString() {
		return "Question [id=" + id + ", description=" + description + ", countNo=" + countNo + ", countYes=" + countYes
				+ "]";
	}
}



// REST API  end points
//@CrossOrigin(origins="*", allowedHeaders="*", maxAge=3600)
@RestController
class VoterController{

	private final VoterRepository repository;

	VoterController(VoterRepository repository) {
		this.repository = repository;
	}

	// Aggregate root
	// tag::get-aggregate-root[]

	// Get all voters
	@GetMapping("/voters")
	List<Voter> all() {
		return repository.findAll();
	}
	// end::get-aggregate-root[]
	
	// one voter
	@GetMapping("/voters/{id}")
	Voter one(@PathVariable long id){
		
		return repository.findById(id)
			.orElseThrow(() -> new VoterNotFoundException(id));
	}

//  Example of using query parameters...but PUT should use body 	
	@PutMapping("/voters")
//	Voter saveVoter(@RequestParam Map<String,String> queryParams){
//	    System.out.println(queryParams);
//		Long id = Long.valueOf(queryParams.get("id"));
//		Long q_id = Long.valueOf(queryParams.get("question"));
//	    System.out.println(id);
//	    System.out.println(q_id);
//		
//		Voter existingVoter = repository.findById(Long.valueOf(id))
//			.orElseThrow(() -> new VoterNotFoundException(id));
//		existingVoter.setQuestions(q_id);;
//		return repository.save(existingVoter);
//	}

	// Save user - update questions list
	Voter saveVoter(@RequestBody Map<String,String> params){
	    System.out.println(params);
	    Long id = Long.valueOf(params.get("id"));
		Long q_id = Long.valueOf(params.get("question"));
	    System.out.println(id);
	    System.out.println(q_id);
	
		Voter existingVoter = repository.findById(id)
			.orElseThrow(() -> new VoterNotFoundException(id));
		existingVoter.setQuestions(q_id);;
		return repository.save(existingVoter);
	}

	
	// add new voter
	@PostMapping("/voters")
	Voter newVoter(@RequestBody Voter voterInfo) {
		
		String voterName = voterInfo.getName();
		// Don't create new user if name exit
		Voter existingVoter = repository.findByNameIgnoreCase(voterName); 
		if (existingVoter == null ) {
		// create a new user
			System.out.println("Trying to save new user.");
			Voter newVoter = new Voter(voterName);
			return repository.save(newVoter);
		}
		else {
			return existingVoter;
		}
	}
}

@RestController
class QuestionController{

	private final QuestionRepository repository;

	QuestionController(QuestionRepository repository) {
		this.repository = repository;
	}

	// Aggregate root
	// tag::get-aggregate-root[]
	@GetMapping("questions")
	List<Question> all() {
		return repository.findAll();
	}
	// end::get-aggregate-root[]

	@GetMapping("questions/{voter_id}")
	List<Question> allforVoter(@PathVariable long voter_id) {
		return repository.findAllQuestions(voter_id);  // need to return by voter id
	}
	
	@GetMapping("questions/countYes/{id}")
	Question updateCountYes(@PathVariable long id) {
		Question q = repository.findById(id)
				.orElseThrow(() -> new QuestionNotFoundException(id));
		q.setCountYes();
		return repository.save(q);
	}
	
	@GetMapping("questions/countNo/{id}")
	Question updateCountNo(@PathVariable long id) {
		Question q = repository.findById(id)
				.orElseThrow(() -> new QuestionNotFoundException(id));
		q.setCountNo();
		return repository.save(q);
	}
	
	@GetMapping("questions/stats/{id}")
	Map<String, Long> totalCounts(@PathVariable long id) {
		Question q = repository.findById(id)
				.orElseThrow(() -> new QuestionNotFoundException(id));
		// let's calc some stats 
		long count_yes = q.getCountYes();
		long count_no = q.getCountNo();
		long total_count =  count_no + count_yes;
		double percent_yes  = ( (double) count_yes/total_count) * 100;
		double percent_no  = ( (double) count_no/total_count) * 100;
		HashMap<String, Long> result_map = new HashMap<>();
	    result_map.put("counts_no", count_yes);
	    result_map.put("counts_yes", count_no);
	    result_map.put("total_votes", total_count);
	    result_map.put("percent_yes", (long)percent_yes);
	    result_map.put("percent_no", (long) percent_no);
	    return result_map;
		
	}
	
	
}
// ERROR HANDLING

// Error handler
class VoterNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	VoterNotFoundException(Long id) {
	    super("Could not find voter " + id);
	  }
}

class QuestionNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	QuestionNotFoundException(Long id) {
	    super("Could not find question " + id);
	  }
}

@ControllerAdvice
class VoterNotFoundAdvice {

    @ResponseBody
    @ExceptionHandler(VoterNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String voterNotFoundHandler(VoterNotFoundException ex) {
    return ex.getMessage();
  }
}

@ControllerAdvice
class QuestionNotFoundAdvice {

	  @ResponseBody
	  @ExceptionHandler(QuestionNotFoundException.class)
	  @ResponseStatus(HttpStatus.NOT_FOUND)
	  String questionNotFoundHandler(QuestionNotFoundException ex) {
	    return ex.getMessage();
	  }
}
